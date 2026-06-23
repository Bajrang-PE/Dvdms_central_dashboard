import React, { Suspense, lazy } from 'react'
// import DashHeader from '../component/dashboard/DashHeader'
import { Route, Router, Routes } from 'react-router-dom'

const ZoneMaster=lazy(()=>import('../component/menus/admin/ZoneMaster'));
const StateConfigCwh=lazy(()=>import('../component/menus/admin/StateConfigCwh'));
const DrugTypeMaster=lazy(()=>import('../component/menus/admin/DrugTypeMaster'));
const StateMaster=lazy(()=>import('../component/menus/admin/StateMaster'));
const SupplierMaster=lazy(()=>import('../component/menus/admin/SupplierMaster'));
const SupplierMappingMaster=lazy(()=>import('../component/menus/admin/SupplierMappingMaster'));
const FacilityTypeMaster=lazy(()=>import('../component/menus/admin/FacilityTypeMaster'));
const GenericDrugMaster=lazy(()=>import('../component/menus/admin/GenericDrugMaster'));
const FacilityTypeMappingMaster=lazy(()=>import('../component/menus/admin/FacilityTypeMappingMaster'));
const JobOrderMaster=lazy(()=>import('../component/menus/admin/JobOrderMaster'));
const StateCdbSyncMaster=lazy(()=>import('../component/menus/admin/StateCdbSyncMaster'));
const NinFacilityMappingMaster=lazy(()=>import('../component/menus/admin/NinFacilityMappingMaster'));
const DistrictMaster=lazy(()=>import('../component/menus/admin/DistrictMaster'));
const SubGroupMaster=lazy(()=>import('../component/menus/admin/SubGroupMaster'));
const GroupMaster=lazy(()=>import('../component/menus/admin/GroupMaster'));
const StateJobDetailsService=lazy(()=>import('../component/menus/services/StateJobDetailsService'));
const DrugMaster=lazy(()=>import('../component/menus/admin/DrugMaster'));
const OutsourceMaster=lazy(()=>import('../component/menus/admin/OutsourceMaster'));
const DrugMappingMaster=lazy(()=>import('../component/menus/admin/DrugMappingMaster'));
const IphsGroupMaster=lazy(()=>import('../component/menus/admin/iphsAdmin/IphsGroupMaster'));
const IphsSubGroupMaster=lazy(()=>import('../component/menus/admin/iphsAdmin/IphsSubGroupMaster'));
const IphsMedicineMaster=lazy(()=>import('../component/menus/admin/iphsAdmin/IphsMedicineMaster'));
const IphsMoleculeDrugMaster=lazy(()=>import('../component/menus/admin/iphsAdmin/IphsMoleculeDrugMaster'));
const MedicineMoleculeMapMst=lazy(()=>import('../component/menus/admin/iphsAdmin/MedicineMoleculeMapMst'));
const IphsDrugMappingMst=lazy(()=>import('../component/menus/admin/iphsAdmin/IphsDrugMappingMst'));
const ProgrammeMappingMaster=lazy(()=>import('../component/menus/admin/ProgrammeMappingMaster'));
const ProgrammeMaster=lazy(()=>import('../component/menus/admin/ProgrammeMaster'));
const HmisFacilityMaster=lazy(()=>import('../component/menus/admin/HmisFacilityMaster'));
const TestMappingMaster=lazy(()=>import('../component/menus/admin/TestMappingMaster'));
const NotFoundPage=lazy(()=>import('./NotFound'));
const QrGenerateMaster=lazy(()=>import('../component/menus/admin/QrGenerateMaster'));

import ModernDashHeader from '../component/dashboard/ModernDashHeader'
import Loader from '../component/Loader'

const Menus = () => {
    return (
        <>
            {/* <DashHeader /> */}
            <ModernDashHeader />
            <Suspense fallback={<Loader />}>
                <Routes>
                    {/*------------------------------------- MASTERS -------------------------------------- */}
                    {/* created by Vishal */}
                    <Route path="state-config-cwh" element={<StateConfigCwh />} />
                    <Route path="drug-type-master" element={<DrugTypeMaster />} />
                    <Route path="supplier-master" element={<SupplierMaster />} />
                    <Route path="supplier-mapping-master" element={<SupplierMappingMaster />} />
                    <Route path="nin-facility-mapping-master" element={<NinFacilityMappingMaster />} />
                    <Route path="district-master" element={<DistrictMaster />} />
                    <Route path="sub-group-master" element={<SubGroupMaster />} />
                    <Route path="drug-master" element={<DrugMaster />} />
                    <Route path="outsource-master" element={<OutsourceMaster />} />
                    <Route path="test-mapping-master" element={<TestMappingMaster />} />

                    {/* created by BG */}
                    <Route path="generic-drug-master" element={<GenericDrugMaster />} />
                    <Route path="zone-master" element={<ZoneMaster />} />
                    <Route path="state-master" element={<StateMaster />} />
                    <Route path="facility-type-master" element={<FacilityTypeMaster />} />
                    <Route path="facility-type-mapping-master" element={<FacilityTypeMappingMaster />} />
                    <Route path="job-order-status-master" element={<JobOrderMaster />} />
                    <Route path="state-cdb-sync-master" element={<StateCdbSyncMaster />} />
                    <Route path="group-master" element={<GroupMaster />} />
                    <Route path="drug-mapping-master" element={<DrugMappingMaster />} />
                    <Route path="qr-generation" element={<QrGenerateMaster />} />

                    {/* created by Vishal */}
                    <Route path="iphs-group-master" element={<IphsGroupMaster />} />
                    <Route path="iphs-sub-group-master" element={<IphsSubGroupMaster />} />
                    <Route path="iphs-medicine-master" element={<IphsMedicineMaster />} />
                    <Route path="iphs-molecule-drug-master" element={<IphsMoleculeDrugMaster />} />
                    <Route path="iphs-medicine-molecule-mapping" element={<MedicineMoleculeMapMst />} />
                    <Route path="iphs-drug-mapping-mst" element={<IphsDrugMappingMst />} />

                    <Route path="programme-master" element={<ProgrammeMaster />} />

                    <Route path="programme-mapping-master" element={<ProgrammeMappingMaster />} />

                    <Route path="hmis-facility-master" element={<HmisFacilityMaster />} />
                    {/* <Route path="test-mapping-master" element={<TestMappingMaster />} /> */}

                    {/*---------------------------- SERVICES-------------------------------------------- */}
                    <Route path="state-job-details" element={<StateJobDetailsService />} />

                    <Route path="*" element={<NotFoundPage />} />

                </Routes>
            </Suspense>
        </>
    )
}

export default Menus
