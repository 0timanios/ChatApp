import axios from 'axios'
import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'

const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoginIn: false,
    isUpdatingProfile: false,

    isCheckingAuth:true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get('/auth/check')
            set({authUser:res.data})
        } catch (error) {
            set({authUser:null})
            console.log('error in check auth: ', error)
        } finally{
            set({isCheckingAuth:false})
        }
    }
}))

export {useAuthStore}