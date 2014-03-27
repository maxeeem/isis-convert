function checkSelected(formID) {
  if ("Brand" == formID.elements.brand.selectedOptions['0'].label) {
    alert("Please select a Brand")
    return false
  }

  if (formID.elements.loadsheets.files.length === 0) {
    alert("Please select a file")
    return false
  }

  return true
}