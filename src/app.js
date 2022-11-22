(function () {
  const form = document.getElementById('form')
  const inputs = document.querySelectorAll('#form__input')
  const table = document.getElementById('table')
  const tableBody = document.getElementById('tBody')
  const students = []

  class Student {
    constructor(surname, firstName, secondName, born, entered, school) {
      this.surname = surname.trim()
      this.firstName = firstName.trim()
      this.secondName = secondName.trim()
      this.born = born
      this.birthDate = new Date(born)
      this.entered = parseInt(entered)
      this.school = school.trim()
      this.graduateYear = parseInt(entered) + 4
    }

    get fullName() {
      return `${this.surname} ${this.firstName} ${this.secondName}`
    }

    get studyYears() {
      const date = new Date()
      const entryDate = new Date(this.entered, 0)
      let studyStatus = `${entryDate.getFullYear()}-${entryDate.getFullYear() + 4} (${date.getFullYear() - entryDate.getFullYear()} курс)`

      if (date.getFullYear() > entryDate.getFullYear() + 4 || date.getFullYear() == entryDate.getFullYear() + 4 && date.getMonth() > 8) studyStatus = 'Закончил'

      return studyStatus
    }

    get studentAge() {
      const splitted = this.born.split('-')
      const formatted = `${splitted[2]}.${splitted[1]}.${splitted[0]}`
      const date = new Date()
      const formattedString = `${formatted} (${date.getFullYear() - this.birthDate.getFullYear()} лет)`
      return formattedString
    }
  }

  function createStudentObj() {
    surname = inputs[0].value
    firstName = inputs[1].value
    secondName = inputs[2].value
    born = inputs[3].value
    entered = inputs[4].value
    school = inputs[5].value
    return new Student(surname, firstName, secondName, born, entered, school)
  }

  function renderStudent(student) {
    const row = document.createElement('tr')
    row.classList.add('tableRow')
    row.innerHTML = `
      <td fullName=${student.fullName}>${student.fullName}</td>
      <td school=${student.school}>${student.school}</td>
      <td birthDate=${student.birthDate}>${student.studentAge}</td>
      <td entered=${student.entered}>${student.studyYears}</td>`
    return row
  }

  function validateStudent(student) {
    const errorMessages = document.createElement('ul')
    let studentIsValidated = true
    let fieldsAreFilled = true

    function createError(message) {
      const error = document.createElement('li')
      error.classList.add('error')
      error.innerHTML = message
      return error
    }

    for (const key of Object.keys(student)) {
      if (student[key] == '') {
        fieldsAreFilled = false
      }
    }

    if (!fieldsAreFilled) {
      const error = createError('Заполните все поля')
      errorMessages.append(error)
      studentIsValidated = false
    } else {
      const dateBenchmark = new Date(1900, 0, 1)

      if (student.birthDate < dateBenchmark) {
        const error = createError('Студент должен был родиться позже 01.01.1900')
        errorMessages.append(error)
        studentIsValidated = false
      }

      const entryInputed = student.entered

      if (isNaN(entryInputed)) {
        const error = createError('Внесите число в поле "Год поступления"')
        errorMessages.append(error)
        studentIsValidated = false
      }

      if (entryInputed < 2000) {
        const error = createError('Студент должен был поступить позже 2000г.')
        errorMessages.append(error)
        studentIsValidated = false
      }
    }

    return {
      errorMessages,
      studentIsValidated
    }
  }

  function saveTable(keyName, obj) {
    localStorage.setItem(keyName, JSON.stringify(obj))
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const student = createStudentObj()
    const validation = validateStudent(student)

    if (!validation.studentIsValidated) {
      const errors = form.querySelectorAll('ul')

      errors.forEach(error => error.remove())
      form.append(validation.errorMessages)
    } else {
      const errors = form.querySelectorAll('ul')

      errors.forEach(error => error.remove())

      const row = renderStudent(student)
      tableBody.append(row)
      students.push(student)
      saveTable(student.firstName, student)

      inputs.forEach(input => input.value = '')
    }
  })

  function sortTable(table, students, event) {
    const sortBy = event.target.id
    const sortedStudents = students.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1)
    let sortedRows = []
    for (const student of sortedStudents) {
      const row = renderStudent(student)
      sortedRows.push(row)
    }
    tableBody.innerHTML = ''
    tableBody.append(...sortedRows)
  }

  table.addEventListener('click', (e) => {
    if (e.target.tagName != 'TH') return
    sortTable(table, students, e)
  })

  const filterForm = document.getElementById('filters')

  filterForm.addEventListener('input', (event) => {
    const filterBy = event.target.dataset.search
    const input = event.target.value

    const studentsFiltered = students.filter(item => item[filterBy].toString().includes(input))
    const filteredRows = []
    for (const student of studentsFiltered) {
      const row = renderStudent(student)
      filteredRows.push(row)
    }

    tableBody.innerHTML = ''
    tableBody.append(...filteredRows)
  })

  function createTable() {
    if (localStorage.length > 0) {
      for (let key of Object.keys(localStorage)) {
        const studentParsed = JSON.parse(localStorage.getItem(key))
        const student = new Student(studentParsed.surname, studentParsed.firstName, studentParsed.secondName, studentParsed.born, studentParsed.entered, studentParsed.school)

        students.push(student)
        const row = renderStudent(student)
        tableBody.append(row)
      }
    }
  }
  createTable()
}())
