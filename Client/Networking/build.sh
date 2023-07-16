#idk why it puts it in a weird folder
protoc -I=../.. ../../Shared/pool.proto --js_out=import_style=commonjs:. --grpc-web_out=import_style=commonjs,mode=grpcwebtext:.
mv Shared/* .
rm -r Shared