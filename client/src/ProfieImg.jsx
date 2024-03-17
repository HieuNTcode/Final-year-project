import Image from "./Image.jsx";

export default function ProfileImg({user,index=0,className=null}) {
  if (!user.imageProfile?.length) {
    return '';
  }
  if (!className) {
    className = 'w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500';
  }
  return (
    <Image className={className} src={user.imageProfile[index]} alt=""/>
  );
}