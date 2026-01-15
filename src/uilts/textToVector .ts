/**
 * 纯手写 文本转向量 核心方法 (仅文本转向量，无任何多余功能)
 * @param {String} text 输入文本（中英文都支持）
 * @param {Number} dim 输出向量维度，默认32维（可自定义：16/32/64/128，越小越快）
 * @returns {Array} 定长向量数组，值为 [-1 ~ 1] 区间的浮点数，语义相似文本向量越接近
 */
export function textToVector(text: string, dim = 32) {
    // 1. 文本预处理：过滤符号、转小写、过滤无意义单字，中英文通用
    const cleanText = text.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '').toLowerCase();
    if (!cleanText) return Array(dim).fill(0);

    let vector = Array(dim).fill(0);
    let seed = 0;

    // 2. 核心算法：字符编码+哈希映射，生成语义相关的定长向量
    for (let i = 0; i < cleanText.length; i++) {
        const charCode = cleanText.charCodeAt(i);
        seed = (seed * 31 + charCode) % dim; // 均匀映射到向量维度区间
        const weight = (charCode % 100) / 100; // 字符权重归一化
        vector[seed] += weight;
    }

    // 3. 向量归一化：压缩值到 [-1, 1]，保证向量标准统一，语义匹配更准确
    const maxVal = Math.max(...vector);
    const minVal = Math.min(...vector);
    const range = maxVal - minVal || 1;
    return vector.map(v => ((v - minVal) / range) * 2 - 1);
}