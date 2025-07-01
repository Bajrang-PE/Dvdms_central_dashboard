import { call, put, takeLatest, all } from 'redux-saga/effects';
import { fetchData } from '../../utils/ApiHooks';
import { setWidgetData, setZoneListData } from './loginSlice';

function* getWidgetDataSaga() {
  const data = yield call(fetchData, 'http://10.226.25.164:8024/hisutils/allWidgetConfiguration?dashboardFor=CENTRAL+DASHBOARD');
  if (data?.status === 1) {
    yield put(setWidgetData(data?.data));
  } else {
    yield put(setWidgetData([]));
  }
}

function* getZoneListDataSaga(action) {
  const data = yield call(fetchData, `api/v1/zones/status?status=${action.payload || '1'}`);
  if (data?.status === 1) {
    yield put(setZoneListData(data?.data));
  } else {
    yield put(setZoneListData([]));
  }
}

export default function* loginSaga() {
  yield all([
    takeLatest('login/getWidgetData', getWidgetDataSaga),
    takeLatest('login/getZoneListData', getZoneListDataSaga),
    // Add more takeLatest for each async function as needed
  ]);
}
