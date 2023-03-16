export interface ModelEtdModelDetail {
    p_id: string;
    ptId: string;
    rName: string;
    PName: string;
    ptName: string;
    mId: string;
    mName: string;
    PMidDimension: string;
    PMaxDimension: String;
    PMinDimension: string;
    PCycletime: string;
    PDate: string;
    PUser: string;
}
export interface MModel {
    mId: string;
    fac: string;
    line: string;
    newModelCode: string;
    newModelName: string;
    proId: string;
}

export interface MModelEdit {
    mId: string;
    pId: string;
    ptId: string;
    rId: string;
    midDimension: string;
    minDimension: string;
    maxDimension: string;
}

export interface model_etd_mst_program {
    proId: number;
    proName: string;
    yc: string;
}
export interface model_filter_model {
    proId: string;
    proName: string;
    mId: string;
    mName: string;
}

export interface MImsMaster {
    fac: string;
    line: string;
    proId: string;
}

