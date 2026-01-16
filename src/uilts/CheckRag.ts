import { textToVector } from './textToVector '
import IndexDB from './indeDB'
import { similarity } from 'ml-distance';
import CashText from './CashText'

/**
 * 将每一次用户执行的事存入索引库
 * @param {String} text 输入文本（中英文都支持）
 * @returns {Array} 定长向量数组，值为 [-1 ~ 1] 区间的浮点数，语义相似文本向量越接近
 */
export const addRag = async (text: string,type:string) => {
    const key = `1${text}-${type}`
    console.log(key)
    const vector = textToVector(key)
    await IndexDB.add('ai-rag',{
        vector,
        text:key,
        time:new Date().toISOString()
    })
}



export const checkRag = async (store:string,text:string) : Promise<string> => {
    const res = await IndexDB.get(store)
    const vector = textToVector(text)
    let max = 0
    let wen :string= ''
    res.forEach(item=>{
        const sim = similarity.cosine(vector, item.vector)
        if(sim>max){
            max = sim
            wen = item.text
        }
    })
    console.log(max)
    console.log(wen)
    const data =CashText.getText()
  if(max>0.5){
      data.forEach(item=>{

          wen = wen+item.text
      })
     return wen+text
  }
  else {
    data.forEach(item=>{
    text = text+item.text
  })
    return text
  }
}