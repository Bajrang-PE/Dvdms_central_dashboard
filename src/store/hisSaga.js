import { call, put, takeLatest, all } from 'redux-saga/effects';
import { fetchData, fetchDeleteData } from '../../utils/HisApiHooks';
import { DrpDataValLab, ToastAlert } from '../modules/his-utils/utils/commonFunction';
import {
  setDashboardForDt,
  setServiceCategoryDrpData,
  setParameterData,
  setParameterDrpData,
  setDataServiceData,
  setDataServiceDrpData,
  setUserServiceData,
  setDashboardSubmenuData,
  setAllTabsData,
  setTabDrpData,
  setAllWidgetData,
  setWidgetDrpData,
  setDashboardData,
} from './hisSlice';

function* getDashboardForDrpDataSaga() {
  const data = yield call(fetchData, 'hisutils/dashboardfor');
  if (data?.status === 1) {
    yield put(setDashboardForDt(data?.data));
  } else {
    yield put(setDashboardForDt([]));
  }
}

function* getServiceCategoryDrpDataSaga() {
  const data = yield call(fetchData, 'hisutils/serviceCategory');
  if (data?.status === 1) {
    yield put(setServiceCategoryDrpData(data?.data));
  } else {
    yield put(setServiceCategoryDrpData([]));
  }
}

function* getAllParameterDataSaga(action) {
  const data = yield call(fetchData, '/hisutils/parameterAll', { masterName: action.payload });
  if (data?.status === 1) {
    yield put(setParameterData(data?.data));
    yield put(setParameterDrpData(DrpDataValLab(data?.data, 'parameterId', 'parameterName', true)));
  } else {
    yield put(setParameterData([]));
    yield put(setParameterDrpData([]));
  }
}

function* getAllServiceDataSaga() {
  const data = yield call(fetchData, '/hisutils/DataServiceDetails', { masterName: 'GLOBAL' });
  if (data?.status === 1) {
    yield put(setDataServiceData(data?.data));
    yield put(setDataServiceDrpData(DrpDataValLab(data?.data, 'serviceId', 'serviceName', true)));
  } else {
    yield put(setDataServiceData([]));
    yield put(setDataServiceDrpData([]));
  }
}

function* getUserServiceDataSaga() {
  const data = yield call(fetchData, '/hisutils/ServiceUserDetails', { masterName: 'GLOBAL' });
  if (data?.status === 1) {
    yield put(setUserServiceData(data?.data));
  } else {
    yield put(setUserServiceData([]));
  }
}

function* getDashboardSubmenuDataSaga() {
  const data = yield call(fetchData, '/hisutils/DashboardsubMenuAll');
  if (data?.status === 1) {
    yield put(setDashboardSubmenuData(data?.data));
  } else {
    yield put(setDashboardSubmenuData([]));
  }
}

function* getAllTabsDataSaga(action) {
  const data = yield call(fetchData, '/hisutils/TabDetails', { masterName: action.payload });
  if (data?.status === 1) {
    yield put(setAllTabsData(data?.data));
    yield put(setTabDrpData(DrpDataValLab(data?.data, 'dashboardId', 'dashboardName', true)));
  } else {
    yield put(setAllTabsData([]));
    yield put(setTabDrpData([]));
  }
}

function* getAllWidgetDataSaga(action) {
  const data = yield call(fetchData, '/hisutils/allWidgetConfiguration', { dashboardFor: action.payload });
  if (data?.status === 1) {
    const fdt = data?.data?.filter(dt => dt?.rptId !== undefined && dt?.rptId !== null && dt?.rptId !== '');
    yield put(setAllWidgetData(fdt));
    yield put(setWidgetDrpData(DrpDataValLab(fdt, 'rptId', 'rptName', false)));
  } else {
    yield put(setAllWidgetData([]));
    yield put(setWidgetDrpData([]));
  }
}

function* getAllDashboardDataSaga(action) {
  const data = yield call(fetchData, '/hisutils/dashboardAll', { masterName: action.payload });
  if (data?.status === 1) {
    yield put(setDashboardData(data?.data));
  } else {
    yield put(setDashboardData([]));
  }
}

function* clearAllCacheSaga() {
  const data = yield call(fetchDeleteData, 'hisutils/clearCache');
  if (data?.status === 1) {
    ToastAlert(data?.message);
  } else {
    ToastAlert(data?.message, 'error');
  }
}

export default function* hisSaga() {
  yield all([
    takeLatest('his/getDashboardForDrpData', getDashboardForDrpDataSaga),
    takeLatest('his/getServiceCategoryDrpData', getServiceCategoryDrpDataSaga),
    takeLatest('his/getAllParameterData', getAllParameterDataSaga),
    takeLatest('his/getAllServiceData', getAllServiceDataSaga),
    takeLatest('his/getUserServiceData', getUserServiceDataSaga),
    takeLatest('his/getDashboardSubmenuData', getDashboardSubmenuDataSaga),
    takeLatest('his/getAllTabsData', getAllTabsDataSaga),
    takeLatest('his/getAllWidgetData', getAllWidgetDataSaga),
    takeLatest('his/getAllDashboardData', getAllDashboardDataSaga),
    takeLatest('his/clearAllCache', clearAllCacheSaga),
  ]);
}
