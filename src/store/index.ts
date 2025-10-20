import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface Userstore {
  token: string;
  setToken: (token: string) => void;
  id:number;
  setId:(id:number) => void
}
const useUserStore = create<Userstore>(
  persist(
    (set) => ({
      token: '',
      setToken: (token: string) => set({ token }),
      id:0,
      setId:(id:number) => set({id})
    }),
    {
      name: 'sprot-user', // localStorage key
    }
  )
);

export default useUserStore;
