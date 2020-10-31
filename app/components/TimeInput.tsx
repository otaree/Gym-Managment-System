/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Select, Stack } from '@chakra-ui/core';

export interface ITime {
  minute: number;
  hour: number;
  ampm: string;
}
const TimeStateInput: React.FC<{
  value: ITime;
  onChange: (value: ITime) => void;
}> = ({ value = { minute: 0, hour: 0, ampm: ''}, onChange }) => {
  const [timeState, setTimeState] = useState<ITime>(value);

  const zeroPad = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  const handleChange = (state: ITime) => {
    onChange(state);
    setTimeState(state);
  };

  return (
    <Stack isInline>
      <Select
        value={timeState.hour}
        onChange={(e) => {
          const hour = Number(e.target.value);
          handleChange({ ...timeState, hour });
        }}
      >
        {Array(12)
          .fill(0)
          .map((_, i) => i + 1)
          .map((el) => (
            <option value={el} key={el}>
              {zeroPad(el)}
            </option>
          ))}
      </Select>
      <Select
        value={timeState.minute}
        onChange={(e) => {
          const minute = Number(e.target.value);
          handleChange({ ...timeState, minute });
        }}
      >
        {Array(60)
          .fill(0)
          .map((_, i) => i)
          .map((el) => (
            <option value={el} key={el}>
              {zeroPad(el)}
            </option>
          ))}
      </Select>
      <Select
        value={timeState.ampm}
        onChange={(e) => handleChange({ ...timeState, ampm: e.target.value })}
      >
        <option value="am">A.M.</option>
        <option value="pm">P.M.</option>
      </Select>
    </Stack>
  );
};

export default TimeStateInput;
