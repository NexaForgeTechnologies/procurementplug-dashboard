import React from 'react'

import HostRoundtableCTR from '@/containers/host-roundtable/HostRoundtableCTR'

function page() {
    return (
        <div className='p-4 border-2 border-gray-200 border-dashed rounded-lg
         dark:border-gray-700'>
            <HostRoundtableCTR />
        </div>
    )
}

export default page