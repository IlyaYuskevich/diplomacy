package rules

func RemovesElementFromSlice(slice []string, value string) []string {
	var index int = -1
	for i, v := range slice {
		if v == value {
			index = i
		}
	}
	if index == -1 {
		return slice
	}
	slice[index] = slice[len(slice)-1] // Copy last element to index i.
	slice[len(slice)-1] = ""           // Erase last element (write zero value).
	slice = slice[:len(slice)-1]       // Truncate slice.
	return slice
}
