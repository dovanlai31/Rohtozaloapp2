import React from 'react';
import { DatePicker, Card, Navbar, Picker, Box } from 'zmp-framework/react';

const datePickerData = [
    {
        // Năm
        values: (function createValues() {
            const arr = [];
            for (let i = 1950; i <= 2030; i += 1) {
                arr.push(i);
            }
            return arr;
        })()
    },
    // Tháng
    {
        values: '0 1 2 3 4 5 6 7 8 9 10 11'.split(' '),
        displayValues:
            'January February March April May June July August September October November December'.split(
                ' '
            )
    },
    // Ngày
    {
        values: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
            22, 23, 24, 25, 26, 27, 28, 29, 30, 31
        ]
    }
];
const CustomdatePicker = ({ onChange }) => {
    const handleChangeDate = (picker, values) => {
        const daysInMonth = new Date(
            picker.value[0],
            picker.value[1] * 1 + 1,
            0
        ).getDate();
        if (values[2] > daysInMonth) {
            picker.cols[2].setValue(daysInMonth);
        }
    };

    return (
        <Box>
            <DatePicker
              dateTimePicker
              datePickerColumns='YYYY-MM-DD'
           
              listInput
              onChange={(date) => {
                console.log({ date });
              }}
            />
        </Box>
    );
};

export default CustomdatePicker