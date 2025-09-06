import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { increment, reset } from '../../redux/slice/counter/counterSlice'

export default function Click() {
  const count = useAppSelector(s => s.counter.value)
  const dispatch = useAppDispatch()
  return (
    <div>
      <h1>Clicks: {count}</h1>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  )
}
