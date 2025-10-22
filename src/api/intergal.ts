import request from '../uilts/request'
export const CreateIntergal = async (user_id: number, intergal: number) => {
  return request({
    url: '/intergal/create',
    method: 'POST',
    data: {
      user_id: user_id,
      intergal: intergal
    }
  })
}
export const GetIntergal = async (user_id: number) => {
  return request({
    url: '/intergal/find',
    method: 'GET',
    params: {
      user_id: user_id
    }
  })
}
export const UpdateIntergal = async (user_id: number, intergal: number) => {
  return request({
    url: '/intergal/update',
    method: 'POST',
    data: {
      user_id: user_id,
      intergal: intergal
    }
  })
}