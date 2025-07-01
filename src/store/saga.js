import { all } from 'redux-saga/effects';
import hisSaga from './hisSaga';
import loginSaga from './loginSaga';
import dashboardConfigSaga from './dashboardConfigSaga';

export default function* rootSaga() {
  yield all([
    hisSaga(),
    loginSaga(),
    dashboardConfigSaga(),
    // add sagas here
  ]);
}
