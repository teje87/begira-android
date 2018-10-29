const initialState = {
        estaciones : [],
        horasEncajadas: [1,2,3],
        disp1: [],
        disp2: [],
}


const reducer = (state = initialState,action) => {
    if(action.type === 'SHOW_ENCAJADOS'){
        return{
            ...state,
            horasEncajadas: action.value
        }
    }
    return state;
};

export default reducer;