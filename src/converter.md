# ＴΞＸＴ ＣＯＮＶΞＲＴΞＲ

<script setup>
import { ref, watch } from 'vue'

const input = ref('')
const output = ref('')

watch(input, (val) => {
  let value = val.toUpperCase()

  value = value.replace(/E/g, 'Ξ')
  value = value.replace(/A/g, 'X')
  value = value.replace(/[\x21-\x7E]/g, c =>
    String.fromCharCode(c.charCodeAt(0) + 0xFEE0)
  )

  output.value = value
})
</script>

<label for="input">Input:</label>  
<textarea id="input" :class="$style.textarea" v-model="input" rows="3"></textarea>

<label for="output">Output:</label>  
<textarea id="output" :class="$style.textarea" :value="output" disabled rows="3"></textarea>

<style module>
    .textarea {
  resize: none;
  overflow: hidden;
  width: 100%;
}
</style>