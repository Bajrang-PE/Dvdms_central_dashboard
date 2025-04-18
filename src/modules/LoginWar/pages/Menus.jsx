import React from 'react'
import DashHeader from '../component/dashboard/DashHeader'
import { Route, Router, Routes } from 'react-router-dom'
import ZoneMaster from '../component/menus/admin/ZoneMaster'
import StateConfigCwh from '../component/menus/admin/StateConfigCwh'
import DrugTypeMaster from '../component/menus/admin/DrugTypeMaster'
import StateMaster from '../component/menus/admin/StateMaster'
import SupplierMaster from '../component/menus/admin/SupplierMaster'
import SupplierMappingMaster from '../component/menus/admin/SupplierMappingMaster'
import FacilityTypeMaster from '../component/menus/admin/FacilityTypeMaster'
import GenericDrugMaster from '../component/menus/admin/GenericDrugMaster'
import FacilityTypeMappingMaster from '../component/menus/admin/FacilityTypeMappingMaster'
import JobOrderMaster from '../component/menus/admin/JobOrderMaster'
import StateCdbSyncMaster from '../component/menus/admin/StateCdbSyncMaster'
import NinFacilityMappingMaster from '../component/menus/admin/NinFacilityMappingMaster'

const Menus = () => {
    return (
        <>
            <DashHeader />
            <Routes>
                {/* created by Vishal */}
                <Route path="state-config-cwh" element={<StateConfigCwh />} />
                <Route path="drug-type-master" element={<DrugTypeMaster />} />
                <Route path="supplier-master" element={<SupplierMaster />} />
                <Route path="supplier-mapping-master" element={<SupplierMappingMaster />} />
                <Route path="nin-facility-mapping-master" element={<NinFacilityMappingMaster />} />

                {/* created by BG */}
                <Route path="generic-drug-master" element={<GenericDrugMaster />} />
                <Route path="zone-master" element={<ZoneMaster />} />
                <Route path="state-master" element={<StateMaster />} />
                <Route path="facility-type-master" element={<FacilityTypeMaster />} />
                <Route path="facility-type-mapping-master" element={<FacilityTypeMappingMaster />} />
                <Route path="job-order-status-master" element={<JobOrderMaster />} />
                <Route path="state-cdb-sync-master" element={<StateCdbSyncMaster />} />
            </Routes>
        </>
    )
}

export default Menus
