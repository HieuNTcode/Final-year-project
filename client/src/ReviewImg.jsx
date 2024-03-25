import Image from "./Image.jsx";

export default function ReviewImg({user,index=0,className=null}) {
  if (!user.imageProfile?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover rounded-full shadow-2xl';
  }
  return (
    <Image className={className} src={user.imageProfile[index]} alt=""/>
  );
}