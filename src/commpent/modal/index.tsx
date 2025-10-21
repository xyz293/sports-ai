import {Modal} from 'antd'
interface ModalsProps {
    children: React.ReactNode;
    open: boolean;
    setIsModalShow: (value: boolean) => void;
}
const Modals = ({children,open,setIsModalShow}:ModalsProps) => {
    return (
        <div>
        <Modal
        open={open} 
        footer={null}
        width={400}
        onCancel={()=>setIsModalShow(false)}>
            {children}
        </Modal>
        </div>
    )
}
export default Modals