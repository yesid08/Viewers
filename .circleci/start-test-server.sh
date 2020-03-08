cd "$(dirname "$0")"

yarn -v
node -v

echo 'Spinning up test DICOMWeb Server'

git clone git://github.com/ohif/viewer-testdata ./test-server/

cd test-server/dcm

# Setup CouchDB
curl -X PUT http://localhost:5984/_users
curl -X PUT http://localhost:5984/_replicator
curl -X PUT http://localhost:5984/_global_changes

# Setup Python client
apt-get -y install software-properties-common
add-apt-repository ppa:deadsnakes/ppa
apt-get -y update
apt-get -y install python3.4 python3-pip
pip3 install pydicom
pip3 install dicomweb-client

python3 seed-db.py
