"use client"

import { columns, dataSource } from '@/components/table/data-source'
import DataTable from '@/components/table/data-table'
import { useMounted } from '@/lib/custom-hook'
import { Table, TableColumnsType, TableProps } from 'antd'
import React from 'react'

export default function MainPage() {
    const isMounted = useMounted();



    return (
        <div>
            {
                isMounted ? (<DataTable />) : (
                    <p>loading..</p>
                )
            }
        </div>
    )
}
