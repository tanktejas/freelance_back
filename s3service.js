const { S3 } = require("aws-sdk");

exports.upload = async (files, email) => {
  const s3obj = new S3({
    accessKeyId: process.env.AWS_ACCES_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const ans = [];

  for (let i = 0; i < files.length; i++) {
    const param = {
      Bucket: process.env.AWS_BUCKET,
      Key: `useruploadedprojects/${email}/${files[i].originalname}`,
      Body: files[i].buffer,
    };

    const res = await s3obj.upload(param).promise();

    ans.push(res);
  }
  return ans;
};
