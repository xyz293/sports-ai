
import {LRU} from './cash'
import {sliceChunk} from './parallet'
import {promise} from './parallet'

/**
 * 串行版本的文件解析函数（不使用线程池�?
 * 用于性能对比测试
 */
export const parallelSerial = async (content: Blob, size: number, type: string, filenme: string): Promise<any> => {
    try {
        const lru = LRU.getInstance()
        if (lru.has(filenme)) {
            const cached = lru.get(filenme)
            return cached?.data || null
        } else {
            const chuncksize: number = 1024 * size
            const chuncklist = []
            let index = 0
            let results: string[] = []
            while (index < content.size) {
                const { chunks, chunkIndex } = sliceChunk(content, chuncksize, index)
                index = chunkIndex
                const res = await getchunckSerial(chunks)  // 串行解析
                results.push(...res)
            }
            lru.set(filenme, results)
            return results
        }
    } catch {
        return ''
    }
}

/**
 * 串行解析分片（不使用线程池）
 */
 export const getchunckSerial = async (list: Blob[]) => {
    try {
        let result: string[] = []
        // 顺序处理每个分片，不使用并发
        for (const chunk of list) {
            const data = await promise(chunk)
            if (data) {
                // Ensure data is iterable before spreading
                if (Array.isArray(data)) {
                    result.push(...data)
                } else if (typeof data === 'string') {
                    result.push(data)
                }
            }
        }
        return result
    } catch {
        return ''
    }
}





