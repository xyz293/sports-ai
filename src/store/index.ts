import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface Userstore {
  token: string;
  setToken: (token: string) => void;
  id:number;
  setId:(id:number) => void
  nickname:string;
  setNickname:(nickname:string) => void
  phone:string;
  setPhone:(phone:string) => void
}
const useUserStore = create<Userstore>()(
  persist(
    (set) => ({
      token: '',
      setToken: (token: string) => set({ token }),
      id:0,
      setId:(id:number) => set({id}),
      nickname:'',
      setNickname:(nickname:string) => set({nickname}),
      phone:'',
      setPhone:(phone:string) => set({phone}),
    }),
    {
      name: 'sprot-user', // localStorage key
    }
  )
);

export default useUserStore;
