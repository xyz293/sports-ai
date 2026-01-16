import { textToVector } from './textToVector '
import IndexDB from './indeDB'
import { similarity } from 'ml-distance';
import CashText from './CashText'

/**
 * 将每一次用户执行的事存入索引库
 * @param {String} text 输入文本（中英文都支持）
 * @returns {Array} 定长向量数组，值为 [-1 ~ 1] 区间的浮点数，语义相似文本向量越接近
 */
// ✅ 最优解：超长文本分句切片存储，治本解决文本过长问题，完美适配你的业务
export const addRag = async (text: string, type: string) => {
    const splitReg = /[,，。！？;\n]/;
    const textList = text.split(splitReg)
        // 过滤掉空字符串、纯空格的无效片段
        .filter(item => item.trim().length > 0)
        // 过滤掉过短的无意义片段（比如只有1-2个字）
        .filter(item => item.trim().length >= 3);
    
    // 3. 如果切片后只有1条，或者文本本身不长，直接存储（兼容短文本）
    if (textList.length <= 1) {
        const key = `${type}-${text.trim()}`;
        const vector = textToVector(key);
        await IndexDB.add('ai-rag', { vector, text: key, time: Date.now()*1000*60*500 });
        return;
    }

    // 4. 如果切片后有多条，循环存储每一个独立短句（核心逻辑）
    for (const singleText of textList) {
        const key = `${type}-${singleText.trim()}`;
        const vector = textToVector(key);
        await IndexDB.add('ai-rag', { vector, text: key, time: Date.now()*1000*60*500 });
    }
    console.log(`超长文本已切片为 ${textList.length} 条独立操作，全部存入向量库`);
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