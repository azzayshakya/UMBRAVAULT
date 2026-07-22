import { message } from 'antd'
import { useEffect, useReducer, useState } from 'react'

const initialState = {
  availabilityMessage: null,
  isAvailable: true,
  isCheckPending: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'CHECKING':
      return {
        ...state,
        isCheckPending: true,
        availabilityMessage: { type: 'Gray', message: 'Checking availability...' },
      }
    case 'AVAILABLE':
      return {
        isAvailable: true,
        isCheckPending: false,
        availabilityMessage: { type: 'Green', message: `${action.value} is available` },
      }
    case 'TAKEN':
      return {
        isAvailable: false,
        isCheckPending: false,
        availabilityMessage: null,
      }
    case 'RESET':
      return { ...initialState, isAvailable: action.isAvailable ?? true }
    case 'ERROR':
      return { ...state, isCheckPending: false }
    default:
      return state
  }
}

export const useCheckAvailability = ({
  defaultInputValue = '',
  debounceTime = 1000,
  fieldName,
  form,
  validateFn,
  checkAvailabilityAPIFn,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [inputValue, setInputValue] = useState(defaultInputValue)

  useEffect(() => {
    if (!inputValue || inputValue === defaultInputValue) return

    if (validateFn) {
      const result = validateFn(inputValue)
      if (result !== true) return
    }

    // Single dispatch = single render, no cascading
    dispatch({ type: 'CHECKING' })

    const handler = setTimeout(async () => {
      try {
        const httpResponse = await checkAvailabilityAPIFn({ userInput: inputValue })

        if (httpResponse.data.result) {
          dispatch({ type: 'AVAILABLE', value: inputValue })
          form.clearErrors(fieldName)
        } else {
          dispatch({ type: 'TAKEN' })
          form.setError(fieldName, { type: 'manual', message: `${inputValue} is already taken` })
        }
      } catch (error) {
        dispatch({ type: 'ERROR' })
        message.error(error?.message || 'Availability check failed.')
      }
    }, debounceTime)

    return () => clearTimeout(handler)
  }, [inputValue]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (currentValue) => {
    setInputValue(currentValue)

    if (currentValue === defaultInputValue) {
      dispatch({ type: 'RESET', isAvailable: true })
      return
    }

    dispatch({ type: 'RESET', isAvailable: false })

    if (validateFn) {
      const result = validateFn(currentValue)
      if (result !== true) {
        form.setError(fieldName, { type: 'manual', message: result })
        return
      }
      form.clearErrors(fieldName)
    }
  }

  return {
    inputValue,
    isAvailable: state.isAvailable,
    isCheckPending: state.isCheckPending,
    availabilityMessage: state.availabilityMessage,
    handleInputChange,
  }
}
