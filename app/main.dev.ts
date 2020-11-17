/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import shortid from 'shortid';
import fs from 'fs';
import { format } from 'date-fns';

// import MenuBuilder from './menu';
// eslint-disable-next-line import/no-cycle
import initializeDB, {
  IMember,
  IMemberProduct,
  IPrepaid,
  IProduct,
  IProductDocument,
  IProductQuery,
  IEmployee,
  IEmployeeDocument,
} from './db';
import ipcEvents from './constants/ipcEvents.json';
import { ISaleProduct } from './db/model/sale';
import { ISaleQuery } from './db/method/sale';
import { saveSaleReceiptPDF } from './utils/saveAsPDF';
import calculateAge from './utils/calculateAge';

const appPath = path.join(app.getPath('appData'), 'gymvenger');

if (!fs.existsSync(appPath)) {
  fs.mkdirSync(appPath);
}

const db = initializeDB(appPath);

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    // width: 1024,
    // height: 728,
    minWidth: 1024,
    minHeight: 728,
    icon: getAssetPath('icon.png'),
    webPreferences:
      (process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
            nodeIntegration: true,
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
          },
  });

  mainWindow.maximize();

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.setMenuBarVisibility(false);
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(createWindow);
} else {
  app.on('ready', createWindow);
}

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// IPC EVENTS
/**
 * A handler function for STAFF_LOGIN event
 * Authenticate a staff
 * @param _event
 * @param {Object} staff
 * @param {string} staff.name
 * @param {string} staff.password
 * @returns {boolean}
 */
ipcMain.handle(
  ipcEvents.STAFF_LOGIN,
  async (_event, { name, password }: { name: string; password: string }) => {
    const isAuth = await db.staff.verifyStaff(name, password);
    return isAuth;
  }
);

/**
 * A handler function to create member
 * @param {Object} memberData
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.CREATE_MEMBER, async (_event, data: IMember) => {
  const filepath = path.join(
    appPath,
    `${data.firstName}_${shortid.generate()}.png`
  );
  const base64Data = data.img.split(';base64,').pop();

  fs.writeFileSync(filepath, base64Data, { encoding: 'base64' });
  const member = await db.member.createMember({ ...data, img: filepath });
  return member;
  // console.log(fs.readFileSync(member.img, 'base64'));
});

export interface IMembersQuery {
  limit?: number;
  skip?: number;
  isMember?: boolean;
  sort?: string;
  search?: string;
  paymentDue?: boolean;
}
/**
 * A handler function to get members
 * @param {Object} queryData
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.GET_MEMBERS, async (_event, data: IMembersQuery) => {
  const res = await db.member.getMembers(data);
  // console.log(fs.readFileSync(member.img, 'base64'));
  // res.members.forEach((member, i) => {
  //   // const img = fs.readdirSync(member.img, 'base64');
  //   console.log(i + 1, member.firstName, '\n', fs.existsSync(member.img));
  //   // img: fs.readdirSync(member.img, 'base64'),
  // });

  // const members = res.members.map((member) => ({
  //   ...member,
  //   img: `data:image/png;base64,${imgToBase64(member.img)}`,
  // }));
  return res;
});

/**
 * A handler function to get member
 * @param {sting} id
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.GET_MEMBER, async (_event, id: string) => {
  const member = await db.member.getMember(id);
  return member;
});

/**
 * A handler function to update member
 * @param {Object} data - event handler argument
 * @param {string} data.id - id of the member
 * @param {Object} data.data - data of members to be update
 * @returns {Object}
 */
ipcMain.handle(
  ipcEvents.UPDATE_MEMBER,
  async (_event, { id, data }: { id: string; data: unknown }) => {
    const member = await db.member.updateMember(id, data);
    return member;
  }
);

/**
 * A handler function to update member monthly payments
 * @param {Object} data - event handler argument
 * @param {string} data.id - id of the member
 * @param {Object} data.data - data of members to be update
 * @returns {Object}
 */
ipcMain.handle(
  ipcEvents.UPDATE_MEMBER_MONTHLY_PAYMENT,
  async (
    _event,
    {
      id,
      data,
    }: { id: string; data: { date: Date; amount: number; paid: boolean } }
  ) => {
    const member = await db.member.updateMemberPayment(
      id,
      data.date,
      data.amount,
      data.paid
    );
    return member;
  }
);

/**
 * A handler function to delete member
 * @param {sting} id - id of the member
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.DELETE_MEMBER, async (_event, id: string) => {
  const member = await db.member.deleteMember(id);
  return member;
});

/**
 * A handler function to create prepaid
 * @param {Object} data - object containing all field for prepaid creation.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.CREATE_PREPAID, async (_event, data: IPrepaid) => {
  const prepaid = await db.prepaid.createPrepaid(data);
  return prepaid;
});

/**
 * A handler function to update prepaid
 * @param {string} data.id - id of prepaid.
 * @param {Object} data.data - object containing all field to update prepaid.
 * @returns {Object}
 */
ipcMain.handle(
  ipcEvents.UPDATE_PREPAID,
  async (_event, { id, data }: { id: string; data: unknown }) => {
    const prepaid = await db.prepaid.updatePrepaid(id, data);
    return prepaid;
  }
);

/**
 * A handler function to delete prepaid
 * @param {string} id - id of the prepaid to delete.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.DELETE_PREPAID, async (_event, id: string) => {
  const prepaid = await db.prepaid.deletePrepaid(id);
  return prepaid;
});

/**
 * A handler function to get prepaid
 * @param {string} id - id of the prepaid to get.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.GET_PREPAID, async (_event, id: string) => {
  const prepaid = await db.prepaid.getPrepaid(id);
  return prepaid;
});

export interface IPrepaidQuery {
  limit?: number;
  skip?: number;
  sort?: string;
  search?: string;
}
/**
 * A handler function to get all prepaid
 * @param {Object} queryData
 * @returns {Object}
 */
ipcMain.handle(
  ipcEvents.GET_ALL_PREPAID,
  async (_event, data: IPrepaidQuery) => {
    const res = await db.prepaid.getAllPrepaid(data);
    return res;
  }
);

/**
 * A handler function to create product
 * @param {Object} data - object containing all field for product creation.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.CREATE_PRODUCT, async (_event, data: IProduct) => {
  const product = await db.product.createProduct(data);
  return product;
});

/**
 * A handler function to update product
 * @param {string} data.id - string of the product.
 * @param {Object} data.data - object containing all field to update.
 * @returns {Object}
 */
ipcMain.handle(
  ipcEvents.UPDATE_PRODUCT,
  async (_event, { id, data }: { id: string; data: unknown }) => {
    const product = await db.product.updateProduct(id, data);
    return product;
  }
);

/**
 * A handler function to delete product
 * @param {string} id - id of the product.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.DELETE_PRODUCT, async (_event, id: string) => {
  const product = await db.product.deleteProduct(id);
  return product;
});

/**
 * A handler function to get product
 * @param {string} id - id of the product.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.GET_PRODUCT, async (_event, id: string) => {
  const product = await db.product.getProduct(id);
  return product;
});

/**
 * A handler function to get product
 * @param {data} queryDate
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.GET_PRODUCTS, async (_event, data: IProductQuery) => {
  const res = await db.product.getProducts(data);
  return res;
});

export interface ICreateSaleData {
  products: { product: IProductDocument; quantity: number }[];
  buyer: { memberId?: string; name: string; isMember: boolean; id?: string };
}
/**
 * A handler function to create sale
 * @param {Object} data.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.CREATE_SALE, async (_event, data: ICreateSaleData) => {
  const saleProducts = data.products.map((el) => {
    const { product, quantity } = el;
    const saleProduct: ISaleProduct = {
      name: product.name,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      quantity,
    };
    return saleProduct;
  });
  const totalPurchasePrice = saleProducts.reduce(
    (acc, curr) => acc + curr.purchasePrice * curr.quantity,
    0
  );
  const totalSellingPrice = saleProducts.reduce(
    (acc, curr) => acc + curr.sellingPrice * curr.quantity,
    0
  );

  if (data.buyer.isMember && data.buyer.id && data.buyer.id.trim().length > 0) {
    const member = await db.member.getMember(data.buyer.id);
    const products = [
      ...member.products,
      {
        date: new Date(),
        grossTotal: totalSellingPrice,
        products: data.products.map((item) => ({
          name: item.product.name,
          price: item.product.sellingPrice,
          quantity: item.quantity,
        })),
      },
    ] as IMemberProduct[];
    await db.member.updateMember(member._id!, { products });
  }
  await Promise.all(
    data.products.map((el) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      db.product.updateProduct(el.product._id!, {
        quantity: el.product.quantity - el.quantity,
      })
    )
  );

  const sale = await db.sale.createSale({
    buyer: data.buyer,
    products: saleProducts,
    totalPurchasePrice,
    totalSellingPrice,
  });
  return sale;
});

/**
 * A handler function to delete sale
 * @param {string} id- id of the sale.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.DELETE_SALE, async (_event, id: string) => {
  const sale = await db.sale.deleteSale(id);
  return sale;
});

/**
 * A handler function to get a sale
 * @param {string} id- id of the sale.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.GET_SALE, async (_event, id: string) => {
  const sale = await db.sale.getSaleById(id);
  return sale;
});

/**
 * A handler function to get all sales
 * @param {Object} queryData
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.GET_SALES, async (_event, data: ISaleQuery) => {
  const res = await db.sale.getSales(data);
  return res;
});

/**
 * A handler function to save sale receipt in pdf
 * @param {string} id - id of the sale
 */
ipcMain.handle(ipcEvents.PDF_SALES, async (_event, id: string) => {
  const sale = await db.sale.getSaleById(id);
  await saveSaleReceiptPDF(sale);
});

/**
 * A handler function to save csv file of member
 * @param {string} queryData
 */
ipcMain.handle(ipcEvents.CSV_MEMBERS, async () => {
  const filepath = path.join(
    app.getPath('documents'),
    `members_${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}_${shortid.generate()}.csv`
  );

  const writeStream = fs.createWriteStream(filepath);

  writeStream.write(
    'First Name,Last Name,D.O.B,Age,Sex,Occupation,Email,Phone no.,Address,Regular exercise,Injuries,Goal/Target,How did your hear about the club?,Prescribed Medication,"Pregnant (If so, due date)",Given birth in  the last 6 months,Dieting/Fasting,Hospitalised Recently,Have blood Pressure\n',
    'utf-8'
  );
  const count = await db.member.getMembersCount();

  for (let i = 0; i < count; i += 100) {
    // eslint-disable-next-line no-await-in-loop
    const { members } = await db.member.getMembers({ limit: 100, skip: i });
    members.forEach((member) => {
      let pregnant = '';
      if (member.pregnant?.isPregnant) {
        pregnant = 'Yes';
        if (member.pregnant.dueDate) {
          pregnant += ` (${format(member.pregnant.dueDate, 'dd/mm/yyyy')})`;
        }
      }

      writeStream.write(
        [
          member.firstName,
          member.lastName,
          format(member.dob, 'dd/mm/yyyy'),
          calculateAge(member.dob),
          member.sex,
          member.occupation,
          member.email,
          member.phoneNo,
          member.address,
          member.regularExercise,
          member.injuries,
          member.goal,
          member.heardAboutClub,
          member.prescribedMedication,
          pregnant,
          member.givenBirth6Month ? 'Yes' : 'No',
          member.dieting ? 'Yes' : 'No',
          member.hospitalisedRecently ? 'Yes' : 'No',
          member.highBloodPressure ? 'Yes' : 'No',
        ]
          .join(',')
          .concat('\n'),
        'utf-8'
      );
    });
  }
  writeStream.end();
  shell.showItemInFolder(filepath);
});

/**
 * A handler function to create employee
 * @param {Object} data.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.CREATE_EMPLOYEE, async (_event, data: IEmployee) => {
  const filepath = path.join(
    appPath,
    `${data.firstName}_${shortid.generate()}.png`
  );
  const base64Data = data.img.split(';base64,').pop();

  fs.writeFileSync(filepath, base64Data, { encoding: 'base64' });
  const employee = await db.employee.createEmployee({ ...data, img: filepath });
  return employee;
});

/**
 * A handler function to update employee
 * @param {string} data.id - string of the employee.
 * @param {Object} data.data - object containing all field to update.
 * @returns {Object}
 */
ipcMain.handle(
  ipcEvents.UPDATE_EMPLOYEE,
  async (_event, { id, data }: { id: string; data: unknown }) => {
    const employee = await db.employee.updateEmployee(id, data);
    return employee;
  }
);

/**
 * A handler function to delete employee
 * @param {string} id - id of the employee.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.DELETE_EMPLOYEE, async (_event, id: string) => {
  const employee = await db.employee.deleteEmployee(id);
  return employee;
});

/**
 * A handler function to get employee
 * @param {string} id - id of the employee.
 * @returns {Object}
 */
ipcMain.handle(ipcEvents.GET_EMPLOYEE, async (_event, id: string) => {
  const employee = await db.employee.getEmployee(id);
  return employee;
});

/**
 * A handler function to get employees
 * @returns {Array}
 */
ipcMain.handle(ipcEvents.GET_EMPLOYEES, async () => {
  const employees = await db.employee.getEmployees();
  return employees;
});

// import faker from 'faker';
// const populateEmployees = async () => {
//   try {
//     const employees = Array(30)
//       .fill(0)
//       .map(() => ({
//         img: faker.internet.avatar(),
//         firstName: faker.name.firstName(),
//         lastName: faker.name.lastName(),
//         dob: new Date(),
//         address: faker.address.city(),
//         mobile: '9876543210',
//       }));
//     await Promise.all(
//       employees.map((employee) => db.employee.createEmployee(employee))
//     );
//     console.log('POPULATED!!!');
//   } catch (error) {
//     console.error('ERROR:::', error);
//   }
// };

// populateEmployees();
// seed
// const seed = async () => {
//   try {
//     // const { members } = await db.member.getMembers({ limit: 1000 });
//     // await Promise.all(
//     //   members.map((member) =>
//     //     db.member.updateMember(member._id!, {
//     //       memberShipExpirationDate: new Date(
//     //         member.createdAt.getFullYear() + 1,
//     //         member.createdAt.getMonth(),
//     //         member.createdAt.getDate()
//     //       ),
//     //     })
//     //   )
//     // );
//     const employees = await db.employee.getEmployees();
//     await Promise.all(
//       employees.map((employee) =>
//         db.employee.updateEmployee(employee._id!, {
//           isEmployed: true,
//           sex: Math.random() > 0.5 ? 'male' : 'female',
//         })
//       )
//     );
//     console.log('POPULATED!!!');
//   } catch (error) {
//     console.error('ERROR:::', error);
//   }
// };

// seed();
