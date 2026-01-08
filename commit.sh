#!/bin/bash
git config user.email "orchids@ai.com"
git config user.name "Orchids AI"
rm -rf tmp_nest
git add .
git commit -m "Initial commit from Orchids"
git push origin master --dry-run
