export type BusFormFields = {
  lgu: string
  barangay: string
  hhId: string
  granteeName: string
  typeOfUpdate: string
  encoded: string
  issue: string
  subjectOfChange: string
  date? : string
}

export type FormFields = {
  id: number
  userId: number
  username: string
  lgu: string
  barangay: string
  hhId: string
  granteeName: string
  typeOfUpdate: string
  encoded: string
  issue: string
  subjectOfChange: string
  date: string
  createdAt: string
  updatedAt: string
}