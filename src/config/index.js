//导入base_url

import base_url_mode from './base_url_mode'

//导出接口根路径地址，直接修改[]里即可更改环境
export let BASE_URL = base_url_mode['dev'].url //当前是开发模式

//导出管理员头像地址根路径
export let BASE_URL_AdminImg = 'http://bingjs.com:83/upload/admin/'

//管理员头像上传地址
export let Upload_AdminImg_URL = 'http://bingjs.com:83/Admin/UploadImg/'

//导出房间图片上传地址
export let Upload_RoomImg_URL ='http://bingjs.com:83/RoomImg/UploadImg/'

//导出房间图片显示的根路径
export let BASE_URL_RoomImg = 'http://bingjs.com:83/upload/room/'