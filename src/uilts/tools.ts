export const getToken = () => {
    const user = localStorage.getItem('sprot-user')
    if(user){
        return JSON.parse(user).state.token
    }
}
export const getId = () => {
    const user = localStorage.getItem('sprot-user')
    if(user){
        return JSON.parse(user).state.id
    }
}

export const getNickname = () => {
    const user = localStorage.getItem('sprot-user')
    if(user){
        return JSON.parse(user).state.nickname
    }
}

export const getPhone = () => {
    const user = localStorage.getItem('sprot-user')
    if(user){
        return JSON.parse(user).state.phone
    }
}