
export const signUpUser = async (id: string, fullname: string) => {
    return {
        id, fullname
    }
}

export const logInUser = async (email: string, password: string) =>{
    return {email, password};
}