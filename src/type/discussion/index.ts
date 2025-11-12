export interface DiscussionList {
    id:number;
    title:string;
    author:string;
    avatar:string;
    view_num:number;
    like_num:number;
    comment_num:number;
    status:number;
    gmt_create:string;
    gmt_modified:string;
    type:'diss'
    description:string;
}

export interface DiscussionType {
    id:number;
    type_name:string;
}