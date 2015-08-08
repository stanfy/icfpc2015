#!/bin/bash
echo "remove old solution"
rm -r ../submission_sources/solution
echo "copying..."
cp -r ../solution ../submission_sources/solution
echo "removing derived data"
rm -r ../submission_sources/solution/objc/DerivedData
echo "removing old archive"
rm -r stanfy_plus_sources.tar.gz
echo "zipping..."
tar -czf stanfy_plus_sources.tar.gz ../submission_sources