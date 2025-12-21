#!/bin/bash

# Check if a directory was provided, otherwise use the current directory
target_dir="${1:-.}"

# Function to traverse and cat files
tree_cat() {
  local dir="$1"
  local indent="$2"

  # List files and directories
  for item in "$dir"/*; do
    # Skip if nothing matches (empty directory)
    [ -e "$item" ] || continue

    # Get the base name of the file/folder
    local name=$(basename "$item")

    if [ -d "$item" ]; then
      # If it's a directory, print name and recurse
      echo "${indent}📁 $name/"
      tree_cat "$item" "  $indent"
    elif [ -f "$item" ]; then
      # If it's a file, print the name and its contents
      echo "${indent}📄 FILE: $name"
      echo "${indent}------------------------------------------"
      # Read file line by line to maintain indentation for the content
      while IFS= read -r line; do
        echo "${indent}  $line"
      done < "$item"
      echo "${indent}------------------------------------------"
      echo ""
    fi
  done
}

# Run the function
echo "Tree-Cat output for: $(realpath "$target_dir")"
echo "=========================================="
tree_cat "$target_dir" ""