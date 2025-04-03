import bcryp from 'bcrypt'

const SALT_ROUNDS = 10

export const hashPassword = async (password:string):Promise<string>=>{
    return bcryp.hash(password, SALT_ROUNDS)
}

export const comparePassword = async(password:string, hash:string): Promise<boolean>=>{
    return await bcryp.compare(password, hash)
}