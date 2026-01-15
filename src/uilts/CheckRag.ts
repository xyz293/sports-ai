import { textToVector } from './textToVector '
import IndexDB from './indeDB'
import { similarity } from 'ml-distance';

/**
 * 将每一次用户执行的事存入索引库
 * @param {String} text 输入文本（中英文都支持）
 * @returns {Array} 定长向量数组，值为 [-1 ~ 1] 区间的浮点数，语义相似文本向量越接近
 */
export const addRag = async (text: string,type:string) => {
    const time = new Date().toISOString()
    const key = `${type}-${text}-${time}`
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
    return wen
}