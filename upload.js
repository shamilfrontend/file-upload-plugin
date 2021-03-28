const bytesToSize = (bytes = 0) => {
  if (bytes === 0) return '0 Byte';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = parseInt(
    Math.floor(
      Math.log(bytes) / Math.log(1024)
    )
  );

  return Math.round(
    bytes / Math.pow(1024, i), 2
  ) + ' ' + sizes[i];
}

const createElement = (tag, classes, content) => {
  const node = document.createElement(tag)

  if (classes.length) {
    node.classList.add(...classes)
  }

  if (content) {
    node.textContent = content
  }

  return node
}

const noop = () => {}

export function upload (selector, options = {}) {
  // список файлов
  let files = []

  const onUpload = options.onUpload ?? noop

  const fileInput = document.querySelector(selector)
  const openBtn = createElement('button', ['btn'], 'Открыть')
  const uploadBtn = createElement('button', ['btn', 'primary'], 'Загрузить')
  const preview = createElement('div', ['preview'])

  uploadBtn.style.display = 'none'

  if (options.multiple) {
    fileInput.setAttribute('multiple', true)
  }

  if (options.accept && Array.isArray(options.accept)) {
    fileInput.setAttribute('accept', options.accept.join(','))
  }

  // append elements
  fileInput.insertAdjacentElement('afterend', preview)
  fileInput.insertAdjacentElement('afterend', uploadBtn)
  fileInput.insertAdjacentElement('afterend', openBtn)

  const triggerFileInput = () => {
    fileInput.click()
  }

  const changeHandler = event => {
    if (!event.target.files) return

    files  = Array.from(event.target.files)

    preview.innerHTML = ''
    uploadBtn.style.display = 'inline-block'

    files.forEach(file => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = e => {
        const src = e.target.result

        preview.insertAdjacentHTML('afterbegin', `
          <div class="preview-image">
            <div
              class="preview-remove"
              data-name="${file.name}"
            >&times;</div>

            <img src="${src}" alt="${file.name}" />

            <div class="preview-info">
              <span>${file.name}</span>
              <span>${bytesToSize(file.size)}</span>
            </div>
          </div>`
        )
      }
    })
  }

  const removeHandler = event => {
    if (!event.target.dataset.name) return

    const { name } = event.target.dataset

    files = files.filter(file => file.name !== name)

    if (files.length === 0) {
      uploadBtn.style.display = 'none'
    }

    const removedImageBlock = preview
      .querySelector(`[data-name="${name}"]`)
      .closest('.preview-image')

    if (removedImageBlock) {
      removedImageBlock.classList.add('removing')
      setTimeout(() => {
        removedImageBlock.remove()
      }, 300)
    }
  }

  const uploadHandler = () => {
    preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
    const previewInfo = preview.querySelectorAll('.preview-info')
    previewInfo.forEach(e => {
      e.style.bottom = 0
      e.innerHTML = `<div class="preview-progress"></div>`
    })

    onUpload(files, previewInfo)
  }

  openBtn.addEventListener('click', triggerFileInput)
  fileInput.addEventListener('change', changeHandler)
  preview.addEventListener('click', removeHandler)
  uploadBtn.addEventListener('click', uploadHandler)
}
