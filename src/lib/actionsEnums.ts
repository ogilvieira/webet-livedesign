interface ActionsEnums {
    GET_PAGE_VARIABLES: 'GET_PAGE_VARIABLES'
    PUT_PAGE_STYLE: 'PUT_PAGE_STYLE',
    REMOVE_PAGE_STYLE: 'REMOVE_PAGE_STYLE'
}

type ActionsEnumsKeys = keyof ActionsEnums;

export { ActionsEnums, ActionsEnumsKeys };