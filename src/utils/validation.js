
export const StringVal = data => {
  const length = data.length
  let validation = Boolean()
  let correction = String()

  if (length < 3) {
    validation = true
    correction = `короткое (${length} < 3-)`
  } else if (length > 150) {
    validation = true
    correction = `длинное (${length} > 150+)`
  }

  if (validation) {
    this.toast(`Ошибка валидации: название слишком ${correction}`, 'error')
  }
  return validation
}
