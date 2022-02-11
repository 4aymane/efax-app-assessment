const router = require('express').Router()
const _ = require('lodash')
const { validateMockFaxForm } = require('../utils/validations')
const { getFormData, saveFile } = require('../utils/helpers')
const axios = require('axios').default
const short = require('short-uuid')

router.post('/receiveFaxStatus', (req, res) => {
    console.log(req.body)
    return res.status(200).send()
})

router.post('/mockfax', async (req, res) => {
  try {
    let errors = []
    const fax_id = short.generate()
    const formFields = await getFormData(req)
    const formValidation = validateMockFaxForm(formFields)

    errors = errors.concat(formValidation.errors)
    if (errors.length > 0) return res.status(403).json({ fax_id, status: 'failure', error: errors.join(', ') })

    const { file, fileName, callback_url } = formValidation
    const saveFileRes = await saveFile(file, fileName)

    if (!saveFileRes) return res.status(500).send()

    setTimeout(() => {
      axios.post(callback_url, { fax_id, status: 'error', error: 'Busy line', attempt: 1 })
      return;
    }, 2000)

    setTimeout(() => {
      axios.post(callback_url, { fax_id, status: 'success', error: 'null', attempt: 2 })
    }, 4000)
     
    res.status(200).json({ fax_id, status: 'queued', error: 'null'})
  } catch (error) {
    return res.status(500).send()
  }
})

module.exports = router
