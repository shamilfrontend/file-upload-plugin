import { upload } from './upload'

upload('#file', {
  multiple: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif']
})
