import path from 'path';

import {
  initializeProduct,
  IProduct,
  IProductDocument,
} from '../model/product';

export interface IProductQuery {
  limit?: number;
  skip?: number;
  sort?: string;
  search?: string;
}

export default function methods(filepath: string) {
  const db = initializeProduct(path.join(filepath, 'product.db'));

  const getProduct = async (id: string): Promise<IProductDocument> => {
    const product = await db.asyncFindOne({ _id: id });
    return product;
  };

  interface IQuery {
    name?: { $regex: RegExp };
  }
  const getProducts = ({
    limit = 10,
    skip = 0,
    sort = '-createdAt',
    search,
  }: IProductQuery): Promise<{
    products: IProductDocument[];
    totalCount: number;
  }> =>
    new Promise((resolve, reject) => {
      const parsedSort = sort
        .split(',')
        .map((el) => (el.startsWith('-') ? [el.substring(1), -1] : [el, 1]))
        .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {});
      const query: IQuery = {};
      if (search) {
        query.name = { $regex: new RegExp(search.trim(), 'i') };
      }

      db.find(query)
        .skip(skip * limit)
        .limit(limit)
        .sort(parsedSort)
        .exec(async (err, products) => {
          if (err) return reject(err);
          const totalCount = await db.asyncCount(query);
          return resolve({ products, totalCount: totalCount as number });
        });
    });

  const createProduct = async (data: IProduct): Promise<IProductDocument> => {
    const product = await db.asyncInsert({ ...data, createdAt: new Date() });
    return product;
  };

  const updateProduct = async (
    id: string,
    data: unknown
  ): Promise<IProductDocument> => {
    await db.asyncUpdate({ _id: id }, { $set: data });
    const product = await getProduct(id);
    return product;
  };

  const deleteProduct = async (id: string): Promise<IProductDocument> => {
    const product = await db.asyncRemove({ _id: id });
    return product as IProductDocument;
  };

  return {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
