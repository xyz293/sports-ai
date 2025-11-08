import {Progress} from 'antd'
const Center = ({progress}:{progress:number}) => {
  return (
    <div>
      <Progress percent={progress} status="active" />
    </div>
  )
}
export default Center