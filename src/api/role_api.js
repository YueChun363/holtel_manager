//角色api层

//导入请求方法
import { get, post } from '../util/request'

//查询角色列表信息
export let list = async function () {
    let res = await get("/Role/List");
    return res;
}

//添加角色信息
export let add = async function (params) {
    let res = await post("/Role/Add", params);
    return res;
}

//获取一个角色信息
export let getOne = async function (params) {
    let res = await get("/Role/GetOne", params)
    return res;
}

//修改角色信息
export let update = async function (params) {
    let res = await post('/Role/Update', params)
    return res;
}

//删除角色信息
export let del = async function (params) {
    let res = await post('/Role/Delete', params)
    return res;
}