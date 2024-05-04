export const initialState = {
    loading: false,
    data: null,
    error: null
}

export const apiReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START': return { ...state, loading: true }
        case 'FETCH_SUCCESS': return { ...state, loading: false, data: action.payload }
        case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload }
    }
}