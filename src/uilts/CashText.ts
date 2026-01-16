import type {TextInfo} from '../type/user'
class CashText{
    private init(){
        localStorage.setItem('text',JSON.stringify([] as TextInfo[]))
    }
    constructor(){
        if(!localStorage.getItem('text')){
            this.init()
        }
    }
    public getText():TextInfo[]{
        const text = JSON.parse(localStorage.getItem('text') || '[]') as TextInfo[]
        if(text.length>0){
         return text.filter(item => item.time > Date.now()).slice(0, 3);
        }
        this.deleteText()
        return []
    }
   public setText(text:TextInfo):void{
        const textList = JSON.parse(localStorage.getItem('text') || '[]') as TextInfo[];
        const isRepeat = textList.some(item => item.text === text.text);
        if(!isRepeat){
            textList.push(text);
            localStorage.setItem('text',JSON.stringify(textList));
        }
    }
    public deleteText():void{
        const textList = JSON.parse(localStorage.getItem('text') || '[]') as TextInfo[]
        localStorage.setItem('text',JSON.stringify(textList.filter(item => item.time < Date.now())))
    }
}

export default new CashText()
