export function randomId(): string {
  return String(Math.floor(Math.random() * 1000000000000))
}

export function randomSlug(): string {
  function getRange(start: number, end: number): number[] {
    const numbers: number[] = []

    for (let i = start; i < end; i++) numbers.push(i)

    return numbers
  }

  const validCharacterCodes = [
    45,
    ...getRange(48, 58),
    ...getRange(65, 91),
    95,
    ...getRange(97, 123)
  ]

  function getRandomCharacter(validCharacterCodes: number[]) {
    const index = Math.floor(Math.random() * validCharacterCodes.length)
    return String.fromCharCode(validCharacterCodes[index])
  }

  const length = Math.floor(Math.random() * 63) + 1

  const characters: string[] = []

  for (let i = 0; i < length; i++)
    characters.push(getRandomCharacter(validCharacterCodes))

  return characters.join("")
}
