import { Table, TableProps } from 'antd'
import React from 'react'
import { columns, dataSource, UserData } from './data-source'

export default function DataTable() {

    const onChange: TableProps<UserData>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className='mx-auto w-[80%]'>
            <Table className='border rounded-lg' columns={columns} dataSource={dataSource} onChange={onChange} />
        </div>
    )
}
