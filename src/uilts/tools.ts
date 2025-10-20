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